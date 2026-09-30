(() => {
  const demo = document.getElementById('stream-demo');
  if (!demo) return;

  // A teaching model of one partition, not the C++ broker or durable storage.
  const events = [];
  const activity = [];
  let committed = -1;
  let next = 0;
  let stopped = false;
  const eventTypes = ['SESSION_STARTED', 'ATTEMPT_STARTED', 'ATTEMPT_FAILED', 'ATTEMPT_STARTED', 'ROUTE_SENT', 'SESSION_ENDED'];

  const count = document.getElementById('stream-count');
  const committedOutput = document.getElementById('stream-committed');
  const nextOutput = document.getElementById('stream-next');
  const log = document.getElementById('stream-log');
  const activityOutput = document.getElementById('stream-activity');
  const status = document.getElementById('stream-status');

  function renderList(element, lines, emptyMessage) {
    element.replaceChildren();
    for (const line of lines.length ? lines : [emptyMessage]) {
      const item = document.createElement('li');
      item.textContent = line;
      if (!lines.length) item.className = 'empty-state';
      element.append(item);
    }
  }

  function render(message) {
    count.textContent = String(events.length);
    committedOutput.textContent = committed < 0 ? 'None' : String(committed);
    nextOutput.textContent = String(next);
    renderList(log, events.map((event, offset) => `${offset} · ${event}`), 'Publish an event to begin.');
    // Keep only the latest activity in view; publishing never truncates the log.
    renderList(activityOutput, activity.slice(-12), 'No events processed yet.');
    status.textContent = message;
  }

  function restart() {
    next = committed + 1;
    stopped = false;
    activity.push(`RESTART · resume at ${next}`);
  }

  demo.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-stream-action]');
    if (!button || !demo.contains(button)) return;
    const action = button.dataset.streamAction;

    if (action === 'publish') {
      const offset = events.length;
      const type = eventTypes[offset % eventTypes.length];
      events.push(type);
      render(`Published ${type} at offset ${offset}. Consumer progress is unchanged.`);
    } else if (action === 'consume') {
      if (stopped) restart();
      const pending = events.length - next;
      while (next < events.length) {
        activity.push(`PROCESS ${next} · ${events[next]} → commit ${next}`);
        committed = next;
        next += 1;
      }
      render(pending ? `Processed and committed ${pending} event${pending === 1 ? '' : 's'}. Next read starts at ${next}.` : 'No pending events. The consumer is caught up.');
    } else if (action === 'restart') {
      restart();
      render(`Consumer restarted at offset ${next}. The log and committed position are unchanged.`);
    } else if (action === 'crash') {
      if (stopped) restart();
      if (next >= events.length) {
        render('Publish a new event first so there is a pending event to process.');
        return;
      }
      activity.push(`PROCESS ${next} · ${events[next]} → CRASH, no commit`);
      stopped = true;
      render(`Processed offset ${next}, then crashed before committing. Consume again to restart and process offset ${next} a second time.`);
    } else if (action === 'replay') {
      for (let offset = 0; offset < events.length; offset += 1) {
        activity.push(`REPLAY ${offset} · ${events[offset]} → no commit`);
      }
      render(events.length ? `Replayed ${events.length} event${events.length === 1 ? '' : 's'}. The committed offset and next read position are unchanged.` : 'The log is empty. Publish an event before replaying.');
    } else if (action === 'reset') {
      events.length = 0;
      activity.length = 0;
      committed = -1;
      next = 0;
      stopped = false;
      render('Model reset. Publish an event to begin.');
    }
  });

  demo.hidden = false;
  render('Ready. Publish an event to begin.');
})();
