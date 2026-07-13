export const LOADING_DELAY = {
  search: 500,
  filter: 600,
  viewMore: 1000,
  page: 800,
}

export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
