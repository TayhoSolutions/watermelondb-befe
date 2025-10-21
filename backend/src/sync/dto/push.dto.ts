import { IsObject, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class TableChanges {
    created: any[];
    updated: any[];
    deleted: string[];
}

class Changes {
    @ValidateNested()
    @Type(() => TableChanges)
    projects: TableChanges;

    @ValidateNested()
    @Type(() => TableChanges)
    tasks: TableChanges;
}

export class PushDto {
    @IsObject()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Changes)
    changes: Changes;
}
