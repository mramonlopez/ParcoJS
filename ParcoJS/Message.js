var Message = function() {
    this._fields = {};
}

Message.prototype.addField = function (name, type, size) {
    if (this._fields[name]) {
        throw "Fiels already exists";
    }

    var field = new ParcoJS.Field(type, size);

    this._fields[name] = field;
};

Message.prototype.getBuffer = function () {
    var size = 0;
    for (field in this._fields) {
        size += this._fields[field].getSize();
    }

    var buffer = new ArrayBuffer(size);
    console.log('Buffer', buffer);
};

window.ParcoJS = window.ParcoJS || {};
window.ParcoJS.Message = Message;
