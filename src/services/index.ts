// services/index.ts
// Barrel export berbentuk namespace (BUKAN flat) supaya aman dari bentrok
// nama fungsi antar modul saat project berkembang, mis:
//
//   import { authService, teamService } from '@/core/services';
//   await authService.login({ email, password });
//   await teamService.getMyTeam();
//
// Jika lebih suka import langsung per-fungsi, tetap bisa seperti biasa:
//   import { login } from '@/core/services/auth.service';

export * as authService from './auth.service';
export * as competitionService from './competition.service';
export * as registrationService from './registration.service';
export * as storageService from './storage.service';
export * as submissionService from './submission.service';
export * as teamService from './team.service';
export * as userService from './user.service';
