/**
 * 카드 재발급 현황
 */
enum ReissueState {
  NONE = 'none',
  PICK_UP_REQUESTED = 'pick_up_requested',
  IN_PROGRESS = 'in_progress',
  APPLY = 'apply',
  DONE = 'done',
}
export default ReissueState;
