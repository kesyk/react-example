import { T } from 'common/@components/t'
import { ApiErrorData } from 'common/api/error/api-error'
import { ErrorsMapList, FormTransformers } from 'forms-builder'
import { FieldData } from 'forms-builder/dist'
import React from 'react'

export type TransformableError =
  | {
      id: string
      values: any
    }
  | string
  | false
  | undefined

export const camelCase2Dash = (s: string) =>
  s.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()

export const errorTransform = (prefix: string) => (
  error: TransformableError,
  field: FieldData
) => {
  let id = `${prefix}.${camelCase2Dash(field.name)}!`

  if (!error) return

  if (typeof error === 'string') {
    id += error
    return <T id={id} />
  } else {
    id += error.id
    return <T id={id} values={error.values ? error.values : undefined} />
  }
}

interface LabelFormatterOptions<TFields> {
  /**
   * Modify T values
   */
  values?: (
    field: FieldData<any, keyof TFields>
  ) => ({ [key: string]: React.ReactNode }) | undefined
}

const labelFormatter = <TFields extends {}>(
  prefix: string,
  options?: LabelFormatterOptions<TFields>
) => (field: FieldData<any, keyof TFields>) => (
  <T
    id={`${prefix}.${camelCase2Dash(field.name)}`}
    values={options && options.values ? options.values(field) : undefined}
  />
)

interface FormTransformerOptions<TFields> {
  label?: LabelFormatterOptions<TFields>
}

export const formTransformers = <TFields extends {} = {}>(
  prefix: string,
  options: FormTransformerOptions<TFields> = {}
): FormTransformers<TFields, TransformableError> => ({
  error: errorTransform(prefix + '.field'),
  label: labelFormatter(prefix + '.field', options.label)
})

export const apiToFormErrors = <TFields extends {}>(
  errors: ApiErrorData[]
): ErrorsMapList<TFields> =>
  errors.filter(x => x.field).map(x => ({
    field: x.field as any,
    // tslint:disable-next-line:no-object-literal-type-assertion
    error: {
      id: camelCase2Dash(x.code),
      values: x.additionalFields
    } as TransformableError
  }))
