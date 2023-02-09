import {readFile} from 'fs/promises';
import {SSM} from '@aws-sdk/client-ssm';
import {parse} from 'yaml';
import type {Parameters} from '../parameters.js';
import {parametersSchema} from '../parameters.js';

export const importParameters = async (
    region : string,
    parameters : Parameters,
    prefix ?: string,
) : Promise<void> => {
    const ssm = new SSM({region});

    for (const [name, parameter] of Object.entries(parameters)) {
        await ssm.putParameter({
            Name: `${prefix ?? ''}${name}`,
            Type: typeof parameter === 'string' ? 'String' : parameter.type,
            Value: typeof parameter === 'string' ? parameter : parameter.value,
            Overwrite: true,
        });
    }
};

type Options = {
    prefix ?: string;
};

export const importAction = async (region : string, file : string, options : Options) : Promise<void> => {
    const yaml = await readFile(file, {encoding: 'utf-8'});
    const parameters = parametersSchema.parse(parse(yaml));

    await importParameters(region, parameters, options.prefix);
};
