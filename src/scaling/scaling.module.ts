import { Module } from '@nestjs/common';
import { ScalingController } from './scaling.controller';
import { ScalingService } from './scaling.service';

@Module({
  controllers: [ScalingController],
  providers: [ScalingService],
})
export class ScalingModule {}
