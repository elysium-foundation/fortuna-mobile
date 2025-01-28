import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '../../../../components/UI/Box';
import { isEqual } from 'lodash';
import { getMemoizedInterface } from '../../../../selectors/snaps/interfaceController';
import { SnapInterfaceContextProvider } from './SnapInterfaceContext';
import { mapToTemplate } from './utils';
import TemplateRenderer from '../../../UI/TemplateRenderer';
import { ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Container } from '@metamask/snaps-sdk/dist/jsx/components/Container.cjs';
import { strings } from '../../../../../locales/i18n';

interface SnapUIRendererProps {
  snapId: string;
  isLoading: boolean;
  interfaceId: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    height: Dimensions.get('window').height * 0.5,
  },
});

// Component that maps Snaps UI JSON format to MetaMask Template Renderer format
const SnapUIRendererComponent = ({
  snapId,
  isLoading = false,
  interfaceId,
  onCancel,
  onConfirm,
}: SnapUIRendererProps) => {
  const interfaceState = useSelector(
    (state) => getMemoizedInterface(state, interfaceId),
    // We only want to update the state if the content has changed.
    // We do this to avoid useless re-renders.
    (oldState, newState) =>
      isEqual(oldState?.content ?? null, newState?.content ?? null),
  );

  const rawContent = interfaceState?.content;
  const content =
    rawContent?.type === 'Container' || !rawContent
      ? rawContent
      : Container({ children: rawContent });

  const useFooter = content?.props?.children?.[1]?.type === 'Footer';

  // sections are memoized to avoid useless re-renders if one of the parents element re-renders.
  const sections = useMemo(
    () =>
      content &&
      mapToTemplate({
        map: {},
        element: content,
        useFooter,
        onCancel,
        onConfirm,
        t: strings,
      }),
    [content, useFooter, onCancel, onConfirm],
  );

  if (isLoading || !content) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  const { state: initialState, context } = interfaceState;
  return (
    <Box style={styles.root}>
      <SnapInterfaceContextProvider
        snapId={snapId}
        interfaceId={interfaceId}
        initialState={initialState}
        context={context}
      >
        <TemplateRenderer sections={sections} />
      </SnapInterfaceContextProvider>
    </Box>
  );
};

// SnapUIRenderer is memoized to avoid useless re-renders if one of the parents element re-renders.
export const SnapUIRenderer = memo(
  SnapUIRendererComponent,
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
);
