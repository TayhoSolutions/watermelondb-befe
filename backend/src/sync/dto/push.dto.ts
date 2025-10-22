import { IsDateString, IsNotEmpty, IsObject, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

class TableChanges {
    @ApiProperty({
        description: "Array of created records",
        type: "array",
        items: { type: "object" },
        example: [],
    })
    @IsNotEmpty({ each: true })
    created: any[];

    @ApiProperty({
        description: "Array of updated records",
        type: "array",
        items: { type: "object" },
        example: [],
    })
    @IsNotEmpty({ each: true })
    updated: any[];

    @ApiProperty({
        description: "Array of deleted record IDs",
        type: "array",
        items: { type: "string" },
        example: [],
    })
    @IsNotEmpty({ each: true })
    deleted: string[];
}

class Changes {
    @ApiProperty({
        description: "Changes for projects table",
        type: TableChanges,
    })
    @ValidateNested()
    @Type(() => TableChanges)
    projects: TableChanges;

    @ApiProperty({
        description: "Changes for tasks table",
        type: TableChanges,
    })
    @ValidateNested()
    @Type(() => TableChanges)
    tasks: TableChanges;
}

export class PushDto {
    @ApiProperty({
        description: "Changes to push to server",
        type: Changes,
    })
    @IsObject()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Changes)
    changes: Changes;

    @ApiProperty({
        description: "Timestamp of last pull (in milliseconds)",
        example: "1705752000000",
    })
    @IsNotEmpty()
    // @IsDateString()
    lastPulledAt: string;
}
