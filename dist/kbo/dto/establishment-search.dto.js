"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstablishmentSearchDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class EstablishmentSearchDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.EstablishmentSearchDto = EstablishmentSearchDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{10}$/, {
        message: 'Enterprise number must be exactly 10 digits',
    }),
    __metadata("design:type", String)
], EstablishmentSearchDto.prototype, "enterpriseNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^2\d{9}$/, {
        message: 'Establishment number must be exactly 10 digits starting with 2',
    }),
    __metadata("design:type", String)
], EstablishmentSearchDto.prototype, "establishmentNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, {
        message: 'Denomination must be at least 2 characters long',
    }),
    (0, class_validator_1.MaxLength)(100, {
        message: 'Denomination must not exceed 100 characters',
    }),
    __metadata("design:type", String)
], EstablishmentSearchDto.prototype, "denomination", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], EstablishmentSearchDto.prototype, "active", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{4}$/, {
        message: 'Zipcode must be exactly 4 digits',
    }),
    __metadata("design:type", String)
], EstablishmentSearchDto.prototype, "zipcode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, {
        message: 'Page must be at least 1',
    }),
    __metadata("design:type", Number)
], EstablishmentSearchDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, {
        message: 'Limit must be at least 1',
    }),
    (0, class_validator_1.Max)(100, {
        message: 'Limit must not exceed 100',
    }),
    __metadata("design:type", Number)
], EstablishmentSearchDto.prototype, "limit", void 0);
//# sourceMappingURL=establishment-search.dto.js.map