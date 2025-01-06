import { validateKeyringController } from './keyringController';
import { LOG_TAG } from './validateMigration.types';
import { RootState } from '../../reducers';
import { KeyringControllerState } from '@metamask/keyring-controller';
import { EngineState } from '../../core/Engine/types';

describe('validateKeyringController', () => {
  const createMockState = (
    keyringState?: Partial<KeyringControllerState>,
  ): Partial<RootState> => ({
    engine: keyringState
      ? {
          backgroundState: {
            KeyringController: keyringState,
          } as EngineState,
        }
      : undefined,
  });

  const mockValidKeyringState: Partial<KeyringControllerState> = {
    vault: 'mock-vault',
    keyrings: [
      {
        type: 'HD Key Tree',
        accounts: ['0x123'],
      },
    ],
  };

  it('returns no errors for valid state', () => {
    const errors = validateKeyringController(
      createMockState(mockValidKeyringState) as RootState,
    );
    expect(errors).toEqual([]);
  });

  it('returns error if KeyringController state is missing', () => {
    const errors = validateKeyringController(
      createMockState(undefined) as RootState,
    );
    expect(errors).toEqual([
      `${LOG_TAG}: KeyringController state is missing in engine backgroundState.`,
    ]);
  });

  it('returns error if vault is missing', () => {
    const errors = validateKeyringController(
      createMockState({ keyrings: [] }) as RootState,
    );
    expect(errors).toEqual([
      `${LOG_TAG}: KeyringController No vault in KeyringControllerState.`,
    ]);
  });

  it('returns error if keyrings is missing or empty', () => {
    const errors = validateKeyringController(
      createMockState({ vault: 'mock-vault', keyrings: [] }) as RootState,
    );
    expect(errors).toEqual([
      `${LOG_TAG}: KeyringController No keyrings found.`,
    ]);
  });

  it('handles undefined engine state', () => {
    const errors = validateKeyringController({} as RootState);
    expect(errors).toEqual([
      `${LOG_TAG}: KeyringController state is missing in engine backgroundState.`,
    ]);
  });

  it('handles undefined backgroundState', () => {
    const errors = validateKeyringController({ engine: {} } as RootState);
    expect(errors).toEqual([
      `${LOG_TAG}: KeyringController state is missing in engine backgroundState.`,
    ]);
  });
});
