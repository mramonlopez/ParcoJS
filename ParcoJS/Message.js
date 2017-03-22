var Message = function() {
    this._fields = {};
}

Message.prototype.addField = function (name, type, size) {
    if (this._fields[name]) {
        throw "Fiels already exists";
    }

    var field = new ParcoJS.Field(type, size);

    Object.defineProperty(this, name, {
        get: function () {
            return field.getValue();
        },
        set: function (value) {
            field.setValue(value);
        }
    });

    this._fields[name] = field;
};

Message.prototype.getJSONDefinition = function () {
    var definition = [];

    for (field in this._fields) {
        var def = {
                name: field,
                type: this._fields[field].getType()
            };

        if (def.type === ParcoJS.Field.Type.FIXED_STRING) {
            def.size = this._fields[field].getSize();
        }

        definition.push(def);
    }

    return JSON.stringify(definition);
};

Message.prototype.parseJSONDefinition = function(json) {
    var definition = JSON.parse(json);

    // TODO: check if it's array
    for(var i = 0, len = definition.length; i < len; i++) {
        var field = definition[i];

        this.addField(field.name, field.type, field.size);
    }
}

Message.prototype.getBuffer = function () {
    var size = 0,
        field;

    for (field in this._fields) {
        size += this._fields[field].getSize();
    }

    var buffer = new ArrayBuffer(size),
        view = new Uint8Array(buffer);
        pos = 0;

    for (field in this._fields) {
        console.log(field);

        var fieldBuffer = this._fields[field].toArrayBuffer(),
            fieldView = new Uint8Array(fieldBuffer);

        for(var i = 0, len = fieldBuffer.byteLength; i < len; i++) {
            view[pos] = fieldView[i];
            pos++;
        }
    }

    return buffer;
};


Message.prototype.readBuffer = function (buffer) {
    var view = new Uint8Array(buffer),
        pos = 0;

    for (field in this._fields) {
        var size = this._fields[field].getSize(),
            fieldBuffer = buffer.slice(pos, pos + size);

        this._fields[field].fromArrayBuffer(fieldBuffer);

        pos += size;
    }
};

window.ParcoJS = window.ParcoJS || {};
window.ParcoJS.Message = Message;
