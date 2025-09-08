
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from './ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from './check-policies.decorator';
import { Request } from 'express';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector, private abilityFactory: AbilityFactory) {}

  canActivate(context: ExecutionContext): boolean {
    const handlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user;
    if (!user) return false;
    const ability = this.abilityFactory.defineAbility(user);
    return handlers.every((handler) => handler(ability));
  }
}
