import { Router } from "express";
import CartManager from "../managers/cartsManager.js";
import { __dirname } from "../utils.js";
const cartManager = new CartManager(__dirname + "/files/carts.json");
const router = Router();

router.get("/", async (req, res) => {
    const carts = await cartManager.getCarts();
    if (carts.length === 0) {
        res.status(200).json({ message: "No se crearon carritos." });
    } else {
        res.status(200).json({ carts });
    }
});

router.get("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cid);

    if (cart === "No encontrado") {
        res.status(400).json({ message: "Carrito no encontrado" });
    } else if (cart) {
        res.status(200).json(cart);
    } else {
        res.status(400).json({ message: "Carrito no encontrado" });
    }
});

router.post("/", async (req, res) => {
    const cart = await cartManager.createCart();
    if (cart) {
        res.status(201).json({ message: "Carrito creado", cart });
    } else {
        res.status(400).json({ message: "Error creando el carrito" });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        await cartManager.addProductToCart(cid, pid);
        res.status(200).json({ message: "Producto añadido al carrito correctamente." });
    } catch (error) {
        console.error("Error al añadir el producto al carrito", error);
        res
            .status(500)
            .json({ status: "error", message: "Fallo al agregar el producto al carrito." });
    }
});

export default router;