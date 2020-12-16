import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Menu } from "./models/menu";
import { Order } from "./models/order";
import { Sale } from "./models/sale";


//initialize firebase in order to access its services    
admin.initializeApp(functions.config().firebase);

//initialize express server
const app = express()
const main = express()

//add the path to receive request and set json as bodyparser to process the body
main.use('/', app)
main.use(bodyParser.json())
main.use(bodyParser.urlencoded({ extended: false }))

//initialize database and collection
const db = admin.firestore();
const menuCollection = 'menus';
const orderCollection = 'orders';
const saleCollection = 'sales';
//define google cloud function name
export const webApi = functions.https.onRequest(main)



//CONTROLLER UNTUK MENU
//get menus
app.get('/menus',async(req,res) => {
    try{
        const menuQueerySnapshot = await db.collection(menuCollection).get();
        const menus: any[] = [];
        menuQueerySnapshot.forEach(
            (doc) =>{
                menus.push({
                    id: doc.id,
                    data: doc.data(),
                });
            }
        );
        res.status(200).json(menus);

    }catch(error) {
        res.status(500).send(error);
    }
})
// Create new menus
app.post('/menus', async (req, res) => {
    try {
        const menu: Menu = {
            name: req.body['name'],
            price: req.body['price'],
            stock: req.body['stock'],
        }

        const newDoc = await db.collection(menuCollection).add(menu);
        res.status(201).send(`Created a new menu: ${newDoc.id}`);
        
    } catch (error) {res.status(400).send(`menu should contain Name, Price, and Stock!`)}
});
//get a single menu
app.get('/menus/:menuId', (req,res) => {
    const menuId = req.params.menuId; 
    db.collection(menuCollection).doc(menuId).get()
    .then(menu => {
        if(!menu.exists) throw new Error('Menu not found');
        res.status(200).json({id:menu.id, data:menu.data()})})
    .catch(error => res.status(500).send(error));
        
});
// Delete a menu
app.delete('/menus/:menuId', (req, res) => {
    db.collection(menuCollection).doc(req.params.menuId).delete()
    .then(()=>res.status(204).send("Menu successfully deleted!"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})
// Update menus
app.put('/menus/:menuId', async (req, res) => {
    await db.collection(menuCollection).doc(req.params.menuId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.menuId}))
    .catch((error)=> res.status(500).send(error))

});

//CONTROLLER UNTUK ORDER
app.get('/order',async(req,res) => {
    try{
        const orderQueerySnapshot = await db.collection(orderCollection).get();
        const order: any[] = [];
        orderQueerySnapshot.forEach(
            (doc) =>{
                order.push({
                    id: doc.id,
                    data: doc.data(),
                });
            }
        );
        res.status(200).json(order);

    }catch(error) {
        res.status(500).send(error);
    }
})
// Create new order
app.post('/order', async (req, res) => {
    try {
        const order: Order = {
            date: req.body['time'],
            items: req.body['items'],
            total: req.body['total'],
        }

        const newDoc = await db.collection(orderCollection).add(order);
        console.log(newDoc);
        res.status(201).send(`Created a new order: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`order should contain Date, Items, and Total!`)
    }
});
//get a single order
app.get('/order/:orderId', (req,res) => {
    const orderId = req.params.orderId; 
    db.collection(orderCollection).doc(orderId).get()
    .then(order => {
        if(!order.exists) throw new Error('order not found');
        res.status(200).json({id:order.id, data:order.data()})})
    .catch(error => res.status(500).send(error));
        
});
// Delete a order
app.delete('/order/:orderId', (req, res) => {
    db.collection(orderCollection).doc(req.params.orderId).delete()
    .then(()=>res.status(204).send("order successfully deleted!"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})
// Update order
app.put('/order/:orderId', async (req, res) => {
    await db.collection(orderCollection).doc(req.params.orderId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.orderId}))
    .catch((error)=> res.status(500).send(error))

});

//CONTROLLER UNTUK SALES
app.get('/sales',async(req,res) => {
    try{
        const orderQueerySnapshot = await db.collection(saleCollection
            ).get();
        const sale: any[] = [];
        orderQueerySnapshot.forEach(
            (doc) =>{
                sale.push({
                    id: doc.id,
                    data: doc.data(),
                });
            }
        );
        res.status(200).json(sale);

    }catch(error) {
        res.status(500).send(error);
    }
})
// Create new sale
app.post('/sales', async (req, res) => {
    try {
        const sale: Sale = {
            date: req.body['date'],
            items: req.body['items'],
            total: req.body['total'],
        }

        const newDoc = await db.collection(saleCollection
            ).add(sale);
        console.log(newDoc);
        res.status(201).send(`Created a new sale: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`sale should contain Name, Price, and Stock!`)
    }
});
//get a single sale
app.get('/sales/:orderId', (req,res) => {
    const orderId = req.params.orderId; 
    db.collection(saleCollection
        ).doc(orderId).get()
    .then(sale => {
        if(!sale.exists) throw new Error('sale not found');
        res.status(200).json({id:sale.id, data:sale.data()})})
    .catch(error => res.status(500).send(error));
        
});
// Delete a sale
app.delete('/sales/:orderId', (req, res) => {
    db.collection(saleCollection
        ).doc(req.params.orderId).delete()
    .then(()=>res.status(204).send("sale successfully deleted!"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})
// Update sale
app.put('/sales/:orderId', async (req, res) => {
    await db.collection(saleCollection
        ).doc(req.params.orderId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.orderId}))
    .catch((error)=> res.status(500).send(error))

});