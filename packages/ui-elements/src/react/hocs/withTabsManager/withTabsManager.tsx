import React from 'react';

// Define the shape of a generic Tab child component
interface TabElementProps {
  tabId: string;
  [key: string]: any;
}

const withTabsManager = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  TabsWrapper?: React.ComponentType<React.PropsWithChildren<any>>,
  ContentWrapper?: React.ComponentType<React.PropsWithChildren<any>>
): React.FC<P & { children?: React.ReactNode }> =>
  ({ children: tabs, ...props }) => {

    // Safety check / array conversion
    const tabsArray = React.Children.toArray(tabs) as React.ReactElement<TabElementProps>[];

    if (tabsArray.length === 0) {
      return null; // Or some fallback
    }

    const initialTabId = tabsArray[0].props.tabId;
    const [activeTabId, setActiveTab] = React.useState<string>(initialTabId);

    const initActiveTabSetter = React.useCallback(
      (nextActiveTabId: string) => () => {
        setActiveTab(nextActiveTabId);
      },
      []
    );

    const tabsWithControl = tabsArray.map((child) => {
      const childProps = { ...child.props };
      const { tabId, ...rest } = childProps;
      const isActive = activeTabId === tabId;

      delete rest.children;

      return React.createElement(child.type, {
        ...rest,
        key: tabId, // Remember to add a key when mapping!
        onClick: initActiveTabSetter(tabId),
        isActive,
      });
    });

    const activeTabChildren = tabsArray.find(
      (tab) => tab.props.tabId === activeTabId
    )?.props.children;

    return (
      <WrappedComponent {...(props as P)}>
        {TabsWrapper ? (
          <TabsWrapper>{tabsWithControl}</TabsWrapper>
        ) : (
          tabsWithControl
        )}
        {ContentWrapper ? (
          <ContentWrapper>{activeTabChildren}</ContentWrapper>
        ) : (
          activeTabChildren
        )}
      </WrappedComponent>
    );
  };

export default withTabsManager;
