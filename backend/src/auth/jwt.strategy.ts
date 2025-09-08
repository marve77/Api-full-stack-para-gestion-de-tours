import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwt_secret',
    });
  }

  async validate(payload: any) {
    // Convierte roles: ['editor'] a roles: [{ name: 'editor' }]
    const roles = Array.isArray(payload.roles)
      ? payload.roles.map((name) => ({ name }))
      : [];
    return { userId: payload.sub, email: payload.username, roles };
  }
}
