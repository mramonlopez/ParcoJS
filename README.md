# ParcoJS

```
var a = new ParcoJS.Field(ParcoJS.Field.Type.INT8);
a.setValue(18);

var c = new ParcoJS.Field(ParcoJS.Field.Type.INT8);
c.fromArrayBuffer(a.toArrayBuffer());
c.getValue();

// Server
var m = new ParcoJS.Message();
m.addField('id', ParcoJS.Field.Type.INT8);
m.addField('x', ParcoJS.Field.Type.FLOAT64);
m.addField('y', ParcoJS.Field.Type.FLOAT64);

m.id = 11;
m.x = 3.2;
m.y = 1.0;

// Send message definition (handshake protocol)
var json = m.getJSONDefinition();

// Send binary package
var buffer = m.getBuffer();

// Client
var m2 = new ParcoJS.Message();
m2.parseJSONDefinition(json);
m2.readBuffer(buffer);

console.log(m2.id, m2.x, m2.y);
```
