import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../features/members/member-profile/member-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {

if (component.editform?.dirty) {
  return confirm("⚠️ Are you sure you want to continue? 😮 All unsaved changes will be lost.");
}
  return true;
};
