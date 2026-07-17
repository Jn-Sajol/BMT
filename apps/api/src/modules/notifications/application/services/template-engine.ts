import { Injectable } from "@nestjs/common"

@Injectable()
export class TemplateEngine {
  private templates = new Map<string, string>([
    ["workflow-failed", "Workflow {{workflow}} in workspace {{workspace}} failed with error: {{error}}."],
    ["workflow-approved", "Workflow {{workflow}} was approved by {{user}} in workspace {{workspace}}."],
    ["mention", "User {{user}} mentioned you in workflow {{workflow}}."],
  ])

  public compile(templateKey: string, variables: Record<string, string>): string {
    const template = this.templates.get(templateKey) || "Notification alert for workflow {{workflow}}."
    let result = template

    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value)
    }

    return result
  }
}
