import axios from "axios"

const api = "http://localhost:8080/products";
export const fetchProducts = async () => {
    try {
        const response = await axios.get(api)
        console.log("response",response.data)
    } catch (error) {
        console.error(error);
        }
}