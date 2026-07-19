import { Injectable } from "@nestjs/common"
import { SavedGroup } from "../domain/group-hunter.model"

@Injectable()
export class SavedGroupRepository {
  private savedGroups: SavedGroup[] = []

  public async save(group: SavedGroup): Promise<SavedGroup> {
    const idx = this.savedGroups.findIndex((g) => g.id === group.id)
    if (idx >= 0) {
      this.savedGroups[idx] = group
    } else {
      this.savedGroups.push(group)
    }
    return group
  }

  public async findById(id: string): Promise<SavedGroup | null> {
    return this.savedGroups.find((g) => g.id === id) || null
  }

  public async findAll(): Promise<SavedGroup[]> {
    return this.savedGroups
  }
}
