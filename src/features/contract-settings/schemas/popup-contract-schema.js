import { z } from 'zod';
import { hasPopupContent } from '@/features/contract-settings/lib/popup-contracts';

const REQUIRED_MESSAGE = 'يرجى تعبئة نوع الوثيقة ومحتوى البوب أب';

export const popupContractSchema = z.object({
  instrumentType: z.string().min(1, REQUIRED_MESSAGE),
  popupStatusContract: z.boolean(),
  popupStatusRealestate: z.boolean(),
  contentPopup: z.string().refine(hasPopupContent, REQUIRED_MESSAGE),
  buttonText: z.string(),
  buttonLink: z.string(),
});
