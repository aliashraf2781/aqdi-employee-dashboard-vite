import {
  getOrderEndowmentNazir,
  getOrderLegalAgent,
  hasEndowmentNazir,
  hasLegalAgent,
  pickAgentRelatedField,
} from '../order-detail-steps';
import { pick } from '../pick';
import { calendarTypeLabel, composePartsDob, yesNoLabel } from './labels';

export function mapLegalAgentView(orderData) {
  if (!hasLegalAgent(orderData)) return null;
  const agent = getOrderLegalAgent(orderData);
  const dob = composePartsDob(agent, 'dob_of_property_owner_agent')
    ?? composePartsDob(
        {
          dob_of_property_owner_agent: pickAgentRelatedField(
            orderData,
            'dob_of_property_owner_agent'
          ),
          dob_of_property_owner_agent_day: pickAgentRelatedField(
            orderData,
            'dob_of_property_owner_agent_day'
          ),
          dob_of_property_owner_agent_month: pickAgentRelatedField(
            orderData,
            'dob_of_property_owner_agent_month'
          ),
          dob_of_property_owner_agent_year: pickAgentRelatedField(
            orderData,
            'dob_of_property_owner_agent_year'
          ),
        },
        'dob_of_property_owner_agent'
      );
  const dobType = calendarTypeLabel(
    pickAgentRelatedField(orderData, 'type_dob_property_owner_agent')
  );
  const agencyDate =
    composePartsDob(agent, 'agency_instrument_date_of_property_owner') ??
    composePartsDob(
      {
        agency_instrument_date_of_property_owner: pickAgentRelatedField(
          orderData,
          'agency_instrument_date_of_property_owner'
        ),
        agency_instrument_date_of_property_owner_day: pickAgentRelatedField(
          orderData,
          'agency_instrument_date_of_property_owner_day'
        ),
        agency_instrument_date_of_property_owner_month: pickAgentRelatedField(
          orderData,
          'agency_instrument_date_of_property_owner_month'
        ),
        agency_instrument_date_of_property_owner_year: pickAgentRelatedField(
          orderData,
          'agency_instrument_date_of_property_owner_year'
        ),
      },
      'agency_instrument_date_of_property_owner'
    );

  return {
    id_num: pickAgentRelatedField(orderData, 'id_num_of_property_owner_agent'),
    phone: pickAgentRelatedField(orderData, 'mobile_of_property_owner_agent'),
    dob,
    dob_type: dobType,
    dob_display: dob ? (dobType ? `${dob} (${dobType})` : dob) : null,
    agency_number: pickAgentRelatedField(
      orderData,
      'agency_number_in_instrument_of_property_owner'
    ),
    agency_date: agencyDate,
    agency_date_type: calendarTypeLabel(
      pickAgentRelatedField(orderData, 'type_agency_instrument_date_of_property_owner')
    ),
    owner_is_deceased: yesNoLabel(
      pickAgentRelatedField(orderData, 'property_owner_is_deceased')
    ),
    agent_iban: pick(
      pickAgentRelatedField(orderData, 'agent_iban_of_property_owner'),
      orderData.agent_iban_of_property_owner
    ),
    agent_record_id: pick(
      pickAgentRelatedField(orderData, 'id_num_of_property_owner_agent_record'),
      orderData.id_num_of_property_owner_agent_record
    ),
    agent_dob_hijri: pick(
      orderData.dob_hijri_of_property_owner_agent,
      orderData.dob_hijri_of_property_owner_agent_record
    ),
  };
}

export function mapEndowmentNazirView(orderData) {
  if (!hasEndowmentNazir(orderData)) return null;
  const nazir = getOrderEndowmentNazir(orderData);
  const dob =
    composePartsDob(nazir, 'dob_of_property_owner_agent') ??
    composePartsDob(
      {
        dob_of_property_owner_agent: pickAgentRelatedField(
          orderData,
          'dob_of_property_owner_agent'
        ),
        dob_of_property_owner_agent_day: pickAgentRelatedField(
          orderData,
          'dob_of_property_owner_agent_day'
        ),
        dob_of_property_owner_agent_month: pickAgentRelatedField(
          orderData,
          'dob_of_property_owner_agent_month'
        ),
        dob_of_property_owner_agent_year: pickAgentRelatedField(
          orderData,
          'dob_of_property_owner_agent_year'
        ),
      },
      'dob_of_property_owner_agent'
    );
  const dobType = calendarTypeLabel(
    pickAgentRelatedField(orderData, 'type_dob_property_owner_agent')
  );

  return {
    id_num: pick(
      nazir.id_num_of_property_owner_agent,
      pickAgentRelatedField(orderData, 'id_num_of_property_owner_agent')
    ),
    phone: pick(
      nazir.mobile_of_property_owner_agent,
      pickAgentRelatedField(orderData, 'mobile_of_property_owner_agent')
    ),
    dob,
    dob_type: dobType,
    dob_display: dob ? (dobType ? `${dob} (${dobType})` : dob) : null,
    is_multiple: yesNoLabel(
      pick(
        nazir.is_multiple_trusteeship_deed_copy,
        pickAgentRelatedField(orderData, 'is_multiple_trusteeship_deed_copy')
      )
    ),
  };
}
