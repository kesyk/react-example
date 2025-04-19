import React from 'react'

export const mergeTheme = <T extends { [key: string]: string }>(
  base: T,
  theme: Partial<T> | undefined
): T => {
  const newTheme: Partial<T> = {}

  for (const key of Object.keys(base)) {
    newTheme[key] = base[key]
  }

  if (theme) {
    for (const key of Object.keys(theme)) {
      if (newTheme[key] != null) newTheme[key] += ' ' + theme[key]
      else newTheme[key] = theme[key]
    }
  }

  return newTheme as T
}

export interface ThemeProps<T extends {} = any> {
  theme: T
}

type ReturnedType<T> = Pick<T, Exclude<keyof T, keyof ThemeProps<any>>>

/**
 * Wrap component with theme
 */
export const withTheme = <TTheme extends {}>(
  theme: TTheme | { [key: string]: string }
) =>
  // tslint:disable-next-line:variable-name
  <P extends ThemeProps>(Component: React.ComponentType<P>) =>
    class extends React.PureComponent<
      ReturnedType<P> & Partial<ThemeProps<Partial<TTheme>>>
    > {
      static displayName = `withTheme(${Component.displayName ||
        Component.name ||
        'Component'})`

      render() {
        return (
          <Component
            {...this.props as P}
            theme={
              this.props.theme ? mergeTheme(theme, this.props.theme) : theme
            }
          />
        )
      }
    }
