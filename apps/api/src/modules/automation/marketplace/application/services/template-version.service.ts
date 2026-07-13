import { Injectable } from '@nestjs/common';
import { ITemplateVersioning } from '../../domain/ports/template-versioning.interface';

@Injectable()
export class TemplateVersionService implements ITemplateVersioning {
  compare(versionA: string, versionB: string): number {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      const a = partsA[i] || 0;
      const b = partsB[i] || 0;
      if (a > b) return 1;
      if (b > a) return -1;
    }
    return 0;
  }

  increment(version: string, type: 'major' | 'minor' | 'patch'): string {
    const parts = version.split('.').map(Number);
    let major = parts[0] || 1;
    let minor = parts[1] || 0;
    let patch = parts[2] || 0;

    if (type === 'major') {
      major += 1;
      minor = 0;
      patch = 0;
    } else if (type === 'minor') {
      minor += 1;
      patch = 0;
    } else {
      patch += 1;
    }

    return `${major}.${minor}.${patch}`;
  }
}
