// frontend\src\types\Language.ts

export type Language = 'Chinese' | 'English' | 'Japanese' | 'French' | 'Spanish';

export const languageIcons: Record<Language, string> = {
    Chinese: '[Chi]',
    English: '[Eng]',
    Japanese: '[Jpn]',
    French: '[Fre]',
    Spanish: '[Spa]',
};
