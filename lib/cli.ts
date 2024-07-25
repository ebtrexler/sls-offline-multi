#!/usr/bin/env node

import yaml from 'js-yaml';
import fs from 'fs';

import concurrently from "concurrently";
import { prefixColors } from "./helpers";

exports.start = function () {

    try {
        const doc = yaml.load(fs.readFileSync(`${process.cwd()}/sls-offline-multi-compose.yml`, 'utf8'));

        let serviceCommands = [];

        const services = doc['services'];
        const stage = doc['stage'] || "local";

        var colorIdx = 0;

        for (const serviceName in services) {
            const svc = services[serviceName];

            //TODO: need some error checking here

            serviceCommands.push({
                command: buildCommand(stage, svc.path, svc.port, svc.watch || false),
                name: serviceName,
                prefixColor: prefixColors[colorIdx % prefixColors.length],
            });

            colorIdx++;
        }

        concurrently(serviceCommands, {
            prefix: "name",
            killOthers: ["failure", "success"],
            restartTries: 3,
        }).then(
            () => {
                // success
            },
            () => {
                // failure
            }
        );
    }

    catch (e: any) {
        console.error(e.message);
    }

};

function buildCommand(stage: string, directory: string, port: number, watch: boolean) {
    const installedPath = `${__dirname}/../node_modules`;

    if (watch) {
        console.log(`watching ${directory}`)
        return `cd ${process.cwd()}/${directory} && nodemon -V --exec "serverless offline start --stage ${stage} --httpPort ${port} --lambdaPort ${Number(port) + 1000}" --watch ${process.cwd()}/${directory} -e ts,js,yml`;
    }
    return `cd ${process.cwd()}/${directory} && serverless offline start --stage ${stage} --httpPort ${port} --lambdaPort ${Number(port) + 1000}`;
}
