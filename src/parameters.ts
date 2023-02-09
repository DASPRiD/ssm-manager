import {z} from 'zod';

export const parameterWithTypeSchema = z.object({
    type: z.string(),
    value: z.string(),
});
export const parameterSchema = z.string().or(parameterWithTypeSchema);
export const parametersSchema = z.record(z.string(), parameterSchema);

export type Parameters = z.infer<typeof parametersSchema>;
