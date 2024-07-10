import { NextFunction, Request, Response } from "express";

import { marvelService } from "../service/MarvelService";

class MarvelController {
    async getCharacterByName(req: Request, res: Response, next: NextFunction) {
        const { name} = req.params;
        if (!name) {
            res.statusMessage = "Can't find parameter";
            res.status(400).end();
            return;
        }
        const data = await marvelService.getCharacterByName(name);
        if(!data){
            res.statusMessage = "Can't find character with such name";
            res.status(404).end();
            return; 
        }
        res.status(200).send(data);
    }
}

export const marvelController = new MarvelController();