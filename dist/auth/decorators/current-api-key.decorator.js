"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentApiKey = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentApiKey = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.apiKey;
});
//# sourceMappingURL=current-api-key.decorator.js.map