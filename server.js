const express= require('express');
const app1= express();
const app2= express();
app1.use(express.static('public'));
app2.use(express.static('public'));
const port1=3000;
const port2=3069;

app1.get('/',()=>{
    app.render('./index.html');
})
app2.get('/',()=>{
    app.render('./index.html');
})






app1.listen(port1,()=>{
    console.log(`Offerer: http://127.0.0.1:${port1}`);
})

app2.listen(port2,()=>{
    console.log(`Answerer: http://127.0.0.1:${port2}`);
})