/* eslint-disable prettier/prettier */

import { BadRequestException, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SearchService } from "./search.service";



@Controller('search')
export class SearchController{
    constructor(private readonly searchService: SearchService) {}

        @Get('/:userId')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async getSearchResults1(@Param('que') que: string, @Param('userId') userId: string): Promise<any> {
            try {
                return "";
            } catch (error) {
                return "";
            }
        }
    
        @Get('/:userId/:que')
        async getSearchResults(@Param('que') que: string, @Param('userId') userId: string): Promise<any> {
            try {
                return this.searchService.getSearchResults(que, userId);
            } catch (error) {
                return {users: [], groups:[]};
            }
        }
}