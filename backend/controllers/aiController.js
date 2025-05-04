import * as ai from '../services/aiService.js';




export const getResult = async (req, res) => {
    try {
        const { prompt } = req.query;
        const result = await ai.generateResult(prompt);
        res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
}