export default function factory (opt) {
  return (ctx) => { ctx.log.debug({ ...opt }, 'action: slack/update-group') }
}
