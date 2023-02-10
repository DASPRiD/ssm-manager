import {writeFile} from 'fs/promises';
import {SSM} from '@aws-sdk/client-ssm';
import type {
    GetParametersByPathCommandOutput,
} from '@aws-sdk/client-ssm/dist-types/commands/GetParametersByPathCommand.js';
import {stringify} from 'yaml';
import type {Parameters} from '../parameters.js';

export const exportParameters = async (
    region : string,
    prefix : string,
    keepPrefix : boolean,
) : Promise<Parameters> => {
    const ssm = new SSM({region});

    const parameters : Parameters = {};
    let nextToken : string | undefined = undefined;

    do {
        const result : GetParametersByPathCommandOutput = await ssm.getParametersByPath({
            Path: prefix,
            Recursive: true,
            NextToken: nextToken,
        });
        nextToken = result.NextToken;

        if (!result.Parameters) {
            continue;
        }

        for (const parameter of result.Parameters) {
            if (!parameter.Name || !parameter.Value || !parameter.Type) {
                continue;
            }

            let name = parameter.Name;

            if (!keepPrefix) {
                name = name.startsWith(prefix) ? name.slice(prefix.length) : name;
            }

            parameters[name] = parameter.Type === 'String'
                ? parameter.Value
                : {
                    type: parameter.Type,
                    value: parameter.Value,
                };
        }
    } while (nextToken !== undefined);

    return parameters;
};

type Options = {
    keepPrefix ?: boolean;
    file ?: string;
};

export const exportAction = async (region : string, prefix : string, options : Options) : Promise<void> => {
    const parameters = await exportParameters(region, prefix, options.keepPrefix ?? false);
    const yaml = stringify(parameters);

    if (!options.file) {
        process.stdout.write(yaml);
        return;
    }

    await writeFile(options.file, yaml, {encoding: 'utf-8'});
};
