import express from 'express';
import db from './../../init/database';
import { Config } from '../../types/interfaces';

const configs = db.config;

export const loadConfig = async (): Promise<Config | null> => {
    return new Promise((res, rej) => {
        configs.find({}, (err, config) => {
            if(err){
                return res(null);
            }
            if(config.length){
                return res(config[0]);
            }
            configs.insert({steamApiKey:'',token:'',port:1337}, (err, config) => {
                if(err){
                    return res(null);
                }
                return res(config);
            });
            
        });
    })
}

export const getConfig: express.RequestHandler = async (_req, res) => {
    const config = await loadConfig();
    if(!config){
        return res.sendStatus(500);
    }
    return res.json(config);
}
export const updateConfig: express.RequestHandler = async (req, res) => {
    const updated: Config = {
        steamApiKey: req.body.steamApiKey,
        port: req.body.port,
        token: req.body.token
    }

    configs.update({}, { $set:updated }, {}, async err => {
        if(err){
            return res.sendStatus(500);
        }
        const newConfig = await loadConfig();
        if(!newConfig){
            return res.sendStatus(500);
        }
        return res.json(newConfig);

    });
}