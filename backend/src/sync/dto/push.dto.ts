import { IsDateString, IsNotEmpty, IsObject, ValidateNested } from "class-validator";

import { Type } from "class-transformer";

class TableChanges {
    @IsNotEmpty({ each: true })
    created: any[];

    @IsNotEmpty({ each: true })
    updated: any[];

    @IsNotEmpty({ each: true })
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

    @IsNotEmpty()
    // @IsDateString()
    lastPulledAt: string;
}
