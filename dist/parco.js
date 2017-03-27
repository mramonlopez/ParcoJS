var Field = function(type, length) {
    this._value = null;

    if (Field.Type[type]) {
        this._type = type;

        if (type === Field.Type.FIXED_STRING) {
            if (size === undefined || size < 1) {
                throw 'Invalid size';
            }

            // UNICODE CHAR = 2 BYTES?
            this._size = length * 2;
        } else {
            this._size = Field.sizes[type];
        }
    } else {
        throw 'Field type is not valid';
    }
};

Field.Type = {
    INT8: 'INT8',
    UINT8: 'UINT8',
    INT16: 'INT16',
    UINT16: 'UINT16',
    INT32: 'INT32',
    UINT32: 'UINT32',
    FLOAT32: 'FLOAT32',
    FLOAT64: 'FLOAT64',
    FIXED_STRING: 'FIXED_STRING',
    STRING: 'STRING'
};

Field.sizes = {
    INT8: 1,
    UINT8: 1,
    INT16: 2,
    UINT16: 2,
    INT32: 4,
    UINT32: 4,
    FLOAT32: 4,
    FLOAT64: 8,
    FIXED_STRING: 'FIXED_STRING',
    STRING: 'STRING'
};

Field.prototype.validate = function (value) {
    // TODO: validate value
    return true;
}

Field.prototype.setValue = function (newValue) {
    if (this.validate(newValue)) {
        // TODO: truncate FIXED_STRING and calculate size if it's a STRING
        this._value = newValue;
    } else {
        throw 'Value of incorrect type';
    }
};

Field.prototype.getValue = function () {
    return this._value;
};

Field.prototype.getSize = function () {
    return this._size;
};

Field.prototype.getType = function() {
    return this._type;
};

Field.prototype.getView = function(buffer) {
    switch (this._type) {
        case Field.Type.INT8:
            return new Int8Array(buffer);
            break;
        case Field.Type.UINT8:
            return new Uint8Array(buffer);
            break;
        case Field.Type.INT16:
            return new Int16Array(buffer);
            break;
        case Field.Type.UINT16:
            return new Uint16Array(buffer);
            break;
        case Field.Type.INT32:
            return new Int32Array(buffer);
            break;
        case Field.Type.UINT32:
            return new Uint32Array(buffer);
            break;
        case Field.Type.FLOAT32:
            return new Float32Array(buffer);
            break;
        case Field.Type.FLOAT64:
            return new Float64Array(buffer);
            break;
        default:
            return new Int8Array(buffer);
    }
};

Field.prototype.fromArrayBuffer = function (buffer) {
    if (this._type === Field.Type.STRING || this._type === Field.Type.FIXED_STRING) {
        // TODO: get buffer
    } else {
        var view = this.getView(buffer);
        this._value = view[0];
    }
};

Field.prototype.toArrayBuffer = function () {
    var buffer = new ArrayBuffer(this._size);

    if (this._type === Field.Type.STRING || this._type === Field.Type.FIXED_STRING) {
        // TODO: write buffer
    } else {
        var view = this.getView(buffer);
        view[0] = this._value;
    }

    return buffer;
};

window.ParcoJS = window.ParcoJS || {};
window.ParcoJS.Field = Field;
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
