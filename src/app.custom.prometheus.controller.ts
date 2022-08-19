import {Controller, Get, Param, Query, Req, Res} from "@nestjs/common";
import {PrometheusController} from "@willsoto/nestjs-prometheus";
import { Request, Response } from 'express';

@Controller('metrics')
export class CustomPrometheusController extends PrometheusController {
    @Get('api/v1/label/__name__/values?')
    //@Get()

    //start=:start&end=:end
    async pen(
        @Query('start') start: number,
        @Query('end') end: number,
        @Res() response: Response,
        @Req() req: Request
    ) {
        console.log("req = " + req.query)
        await super.index(response);
    }
    // async pen(@Res() res: Response, @Param('start') start: string, @Param('end') end: string) {
    //     return this.pen(res,start, end);
    //     //return await super.index(res);
    //     //await super.index(response);
    // }
}