import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ScalingService } from './scaling.service';
import { ScaleRequestDto } from './dto/sacling.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('scaling')
export class ScalingController {
    private readonly logger = new Logger(ScalingController.name);

    constructor(private readonly scalingService: ScalingService) { }


    @IsPublic()
    @Post('scale-up')
    async scaleUp(@Body() data: ScaleRequestDto) {
        this.logger.log('Solicitação de escalonamento para cima recebida', data);
        const result = await this.scalingService.scaleUp(data);
        return result;
    }

    @IsPublic()
    @Post('scale-down')
    async scaleDown(@Body() data: ScaleRequestDto) {
        this.logger.log('Solicitação de escalonamento para baixo recebida', data);
        const result = await this.scalingService.scaleDown(data);
        return result;
    }

}
