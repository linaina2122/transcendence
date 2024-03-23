import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class IntraGuard extends AuthGuard('42auth') {
    constructor() {
        super();
    }
}