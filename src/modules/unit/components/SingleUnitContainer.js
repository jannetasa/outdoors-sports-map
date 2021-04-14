// @flow

import React from 'react';
import type { Node } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import breaks from 'remark-breaks';
import upperFirst from 'lodash/upperFirst';
import get from 'lodash/get';
import has from 'lodash/has';

import Link from '../../common/components/Link';
import SMIcon from '../../home/components/SMIcon';
import {
  getAttr,
  getObservation,
  getOpeningHours,
  getObservationTime,
  createReittiopasUrl,
  createPalvelukarttaUrl,
} from '../helpers';
import getServiceName from '../../service/helpers';
import OutboundLink from '../../common/components/OutboundLink';
import ObservationStatus, {
  StatusUpdated,
  StatusUpdatedAgo,
} from './ObservationStatus';
import UnitIcon from './UnitIcon';

function shouldShowInfo(unit) {
  const hasExtensions =
    unit.extensions &&
    (unit.extensions.length ||
      unit.extensions.lighting ||
      unit.extensions.skiing_technique);

  return hasExtensions || unit.phone || unit.url;
}

type HeaderProps = {
  unit: Object,
  services: Object,
  isLoading: boolean,
};

export const Header = ({ unit, services, isLoading }: HeaderProps) => {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const unitAddress = unit ? getAttr(unit.street_address, language) : null;
  const unitZIP = unit ? unit.address_zip : null;
  const unitMunicipality = unit ? unit.municipality : null;

  return (
    <div className="unit-container-header">
      <div className="unit-container-header-name">
        <div>
          {isLoading ? (
            <h4>{t('UNIT_CONTAINER.LOADING')}</h4>
          ) : (
            <h4>
              {unit
                ? getAttr(unit.name, language)
                : t('UNIT_CONTAINER.NOT_FOUND')}
            </h4>
          )}
        </div>
        <div style={{ alignSelf: 'center' }}>
          <Link
            to="/"
            className="unit-container-close-button close-unit-container"
          >
            <SMIcon icon="close" aria-label={t('UNIT_CONTAINER.CLOSE')} />
          </Link>
        </div>
      </div>
      {unit ? (
        <div className="unit-container-header-description">
          <UnitIcon
            unit={unit}
            alt={getServiceName(unit.services, services, language)}
          />
          <div>
            <p>{getServiceName(unit.services, services, language)}</p>
            <p>
              {unitAddress ? `${unitAddress}, ` : ''}
              {unitZIP ? `${unitZIP} ` : ''}
              <span style={{ textTransform: 'capitalize' }}>
                {unitMunicipality || ''}
              </span>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

type LocationStateProps = {
  unit: Object,
};

const LocationState = ({ unit }: LocationStateProps) => {
  const { t } = useTranslation();
  return (
    <BodyBox title={t('UNIT_CONTAINER.QUALITY')}>
      <ObservationStatus unit={unit} />
    </BodyBox>
  );
};

type LocationInfoProps = {
  unit: Object,
};

const LocationInfo = ({ unit }: LocationInfoProps) => {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  return (
    <BodyBox title={t('UNIT_CONTAINER.INFO')}>
      {get(unit, 'extensions.length') && (
        <p>
          {`${t('UNIT_CONTAINER.LENGTH')}: `}
          <strong>
            {unit.extensions.length}
            km
          </strong>
        </p>
      )}
      {get(unit, 'extensions.lighting') && (
        <p>
          {`${t('UNIT_CONTAINER.LIGHTING')}: `}
          <strong>
            {upperFirst(getAttr(unit.extensions.lighting, language))}
          </strong>
        </p>
      )}
      {get(unit, 'extensions.skiing_technique') && (
        <p>
          {`${t('UNIT_CONTAINER.SKIING_TECHNIQUE')}: `}
          <strong>
            {upperFirst(getAttr(unit.extensions.skiing_technique, language))}
          </strong>
        </p>
      )}
      {unit.phone && (
        <p>
          {t('UNIT.PHONE')}: <a href={`tel:${unit.phone}`}>{unit.phone}</a>
        </p>
      )}
      {unit.www && (
        <p>
          <OutboundLink href={getAttr(unit.www, language)}>
            {t('UNIT.FURTHER_INFO')}
          </OutboundLink>
        </p>
      )}
    </BodyBox>
  );
};

type NoticeInfoProps = {
  unit: Object,
};

/**
 * [NoticeInfo description]
 * @param {Object} unit       [description]
 */
const NoticeInfo = ({ unit }: NoticeInfoProps) => {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();
  const notice = getObservation(unit, 'notice');
  return notice ? (
    <BodyBox title={t('UNIT_CONTAINER.NOTICE')}>
      <StatusUpdated time={getObservationTime(notice)} t={t} />
      <ReactMarkdown
        source={getAttr(notice.value, language)}
        // Insert a break for each newline character
        // https://github.com/rexxars/react-markdown/issues/105#issuecomment-346103734
        plugins={[breaks]}
        break="br"
        escapeHtml
        allowedTypes={['text', 'paragraph', 'break']}
      />
    </BodyBox>
  ) : null;
};

type LocationRouteProps = {
  routeUrl: string,
  palvelukarttaUrl: string,
};

const LocationRoute = ({ routeUrl, palvelukarttaUrl }: LocationRouteProps) => {
  const { t } = useTranslation();

  return (
    <BodyBox title={t('UNIT_CONTAINER.LINKS')}>
      <ul className="unit-container-body-list">
        {routeUrl && (
          <li>
            <OutboundLink href={routeUrl}>
              {t('UNIT_CONTAINER.GET_ROUTE')}
            </OutboundLink>
          </li>
        )}
        {palvelukarttaUrl && (
          <li>
            <OutboundLink href={palvelukarttaUrl}>
              {t('UNIT_CONTAINER.SEE_ON_SERVICE_MAP')}
            </OutboundLink>
          </li>
        )}
      </ul>
    </BodyBox>
  );
};

type LocationOpeningHoursProps = {
  unit: Object,
};

const LocationOpeningHours = ({ unit }: LocationOpeningHoursProps) => {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();
  const openingHours = getOpeningHours(unit, language);

  if (openingHours.length === 0) {
    return null;
  }

  return (
    <BodyBox title={t('UNIT_CONTAINER.OPENING_HOURS')}>
      {openingHours.map((openingHour) => (
        <div key={openingHour} className="unit-container-body-multi-line">
          {openingHour}
        </div>
      ))}
    </BodyBox>
  );
};

type LocationTemperatureProps = {
  observation: Object,
};

const LocationTemperature = ({ observation }: LocationTemperatureProps) => {
  const { t } = useTranslation();
  const temperature = get(observation, 'name.fi');
  const observationTime = getObservationTime(observation);
  return (
    <BodyBox title={t('UNIT_CONTAINER.TEMPERATURE')}>
      <StatusUpdated time={observationTime} t={t} />
      {temperature}
    </BodyBox>
  );
};

type LiveLocationTemperatureProps = {
  observation: Object,
};

const LiveLocationTemperature = ({
  observation,
}: LiveLocationTemperatureProps) => {
  const { t } = useTranslation();
  const temperature = get(observation, 'value.fi');
  const observationTime = getObservationTime(observation);
  return (
    <BodyBox title={t('UNIT_CONTAINER.WATER_TEMPERATURE')}>
      <StatusUpdatedAgo
        time={observationTime}
        t={t}
        sensorName={t('UNIT_CONTAINER.WATER_TEMPERATURE_SENSOR')}
      />
      {`${temperature} °C`}
    </BodyBox>
  );
};

type BodyBoxProps = {
  title: string,
  children: Node,
  className?: string,
};

const BodyBox = ({
  title,
  children,
  className = '',
  ...rest
}: BodyBoxProps) => (
  <div className={`${className} unit-container-body-box`} {...rest}>
    {title && <div className="unit-container-body-box-headline">{title}</div>}
    {children}
  </div>
);

type SingleUnitBodyProps = {
  currentUnit: Object,
  isLoading: boolean,
  liveTemperatureObservation: ?Object,
  routeUrl: string,
  temperatureObservation: ?Object,
  palvelukarttaUrl: string,
};

export const SingleUnitBody = ({
  currentUnit,
  isLoading,
  liveTemperatureObservation,
  routeUrl,
  temperatureObservation,
  palvelukarttaUrl,
}: SingleUnitBodyProps) => {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  return currentUnit && !isLoading ? (
    <div className="unit-container-body">
      <LocationState unit={currentUnit} />
      <NoticeInfo unit={currentUnit} />
      {!liveTemperatureObservation && temperatureObservation && (
        <LocationTemperature observation={temperatureObservation} />
      )}
      {liveTemperatureObservation && (
        <LiveLocationTemperature observation={liveTemperatureObservation} />
      )}
      {shouldShowInfo(currentUnit) && <LocationInfo unit={currentUnit} />}
      {getOpeningHours(currentUnit, language) && (
        <LocationOpeningHours unit={currentUnit} />
      )}
      {(routeUrl || palvelukarttaUrl) && (
        <LocationRoute
          routeUrl={routeUrl}
          palvelukarttaUrl={palvelukarttaUrl}
        />
      )}
    </div>
  ) : null;
};

SingleUnitBody.defaultProps = {
  liveTemperatureObservation: null,
  temperatureObservation: null,
  routeUrl: undefined,
  currentUnit: undefined,
};

SingleUnitBody.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  currentUnit: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  liveTemperatureObservation: PropTypes.object,
  routeUrl: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  temperatureObservation: PropTypes.object,
};

type Props = {
  isLoading: boolean,
  unit: Object,
  services: Object,
  isOpen: boolean,
};

const SingleUnitContainer = ({
  isLoading,
  unit: currentUnit,
  services,
  isOpen,
}: Props) => {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();
  const temperatureObservation = has(currentUnit, 'observations')
    ? getObservation(currentUnit, 'swimming_water_temperature')
    : null;
  const liveTemperatureObservation = has(currentUnit, 'observations')
    ? getObservation(currentUnit, 'live_swimming_water_temperature')
    : null;
  const routeUrl = currentUnit && createReittiopasUrl(currentUnit, language);
  const palvelukarttaUrl =
    currentUnit && createPalvelukarttaUrl(currentUnit, language);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="unit-container">
      <Header unit={currentUnit} services={services} isLoading={isLoading} />
      <SingleUnitBody
        currentUnit={currentUnit}
        isLoading={isLoading}
        liveTemperatureObservation={liveTemperatureObservation}
        routeUrl={routeUrl}
        temperatureObservation={temperatureObservation}
        palvelukarttaUrl={palvelukarttaUrl}
      />
    </div>
  );
};

export default SingleUnitContainer;
