import type { IChildCare } from '@/types/childCare';

export function useState() {
    return {
        childCares: [] as IChildCare[]
    };
}

export type IChildCareState = ReturnType<typeof useState>;