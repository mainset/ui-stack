'use client';

import { Button } from '@mainset/react/components';
import { Menu } from '@mainset/react/containers';
import { Text } from '@mainset/react/elements';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';

import { switchLocalePath } from '../core/locale-path.mjs';
import { useDocs } from './docs-context.js';
import { GlobeIcon } from './icons.js';

/** The same page in another language: every locale has the same routes, so it always exists */
function DocsLocaleMenu() {
  const { site, locale, ui } = useDocs();
  const location = useLocation();
  const navigate = useNavigate();
  const locales = Object.entries(site.locales);

  if (locales.length < 2) return null;

  return (
    <Menu mnuAlign="end">
      <Menu.Trigger>
        <Button
          srfTheme="muted"
          srfVariant="ghost"
          btnIconStart={<GlobeIcon />}
          aria-label={`${ui.language}: ${site.locales[locale].label}`}
        >
          <Text txtSize="sm" txtWeight="medium">
            {locale.toUpperCase()}
          </Text>
        </Button>
      </Menu.Trigger>
      <Menu.List aria-label={ui.language}>
        <Menu.RadioGroup
          mnuValue={locale}
          mnuOnValueChange={(nextLocale) =>
            navigate(
              `${switchLocalePath(site, location.pathname, nextLocale)}${location.hash}`,
            )
          }
        >
          {locales.map(([key, config]) => (
            <Menu.RadioItem key={key} mnuValue={key} lang={config.lang}>
              {config.label}
            </Menu.RadioItem>
          ))}
        </Menu.RadioGroup>
      </Menu.List>
    </Menu>
  );
}

export { DocsLocaleMenu };
