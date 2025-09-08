import { Injectable } from '@nestjs/common';
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { User } from '../user.entity';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'Tour' | 'Reservation' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Actions, Subjects]>>(Ability as AbilityClass<AppAbility>);
    const roles = user.roles.map(r => r.name);
    if (roles.includes('admin')) {
      can('manage', 'all');
    } else if (roles.includes('editor')) {
      can('create', 'Tour');
      can('read', 'Tour');
      can('update', 'Tour');
      can('delete', 'Tour');
      can('create', 'Reservation');
      can('read', 'Reservation');
      can('update', 'Reservation');
      can('delete', 'Reservation');
    }
    return build({
      detectSubjectType: (item: any) => (item && item.constructor ? item.constructor : 'all'),
    });
  }
}
