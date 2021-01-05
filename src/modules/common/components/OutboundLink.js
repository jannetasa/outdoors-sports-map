import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import omit from 'lodash/omit';

import SMIcon from '../../home/components/SMIcon';

const TRANSLATION_PROPS = ['t', 'tReady', 'i18n', 'lng'];

const OutboundLink = translate()(({ t, href, children, ...rest }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    {...omit(rest, TRANSLATION_PROPS)}
  >
    {children}{' '}
    <SMIcon icon="outbound-link" title={t('OUTBOUND_LINK.DESCRIPTION')} />
  </a>
));

OutboundLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default OutboundLink;
