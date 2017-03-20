# ParcoJS

var a = new ParcoJS.Field(ParcoJS.Field.Type.INT8);
a.setValue(18);

var c = new ParcoJS.Field(ParcoJS.Field.Type.INT8);
c.fromArrayBuffer(a.toArrayBuffer());
c.getValue();
