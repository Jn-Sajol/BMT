import { ITemplateVersioning } from '../../domain/ports/template-versioning.interface';
export declare class TemplateVersionService implements ITemplateVersioning {
    compare(versionA: string, versionB: string): number;
    increment(version: string, type: 'major' | 'minor' | 'patch'): string;
}
