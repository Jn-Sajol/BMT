export interface ITemplateVersioning {
    compare(versionA: string, versionB: string): number;
    increment(version: string, type: 'major' | 'minor' | 'patch'): string;
}
