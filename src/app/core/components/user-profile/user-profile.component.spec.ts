
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { UserComponent } from './user.component';

fdescribe('UserComponent', () => {
  let spectator: Spectator<UserComponent>;
  const createComponent = createComponentFactory(UserComponent);

  beforeEach(() => spectator = createComponent());

  it('should ', () => {
    expect(spectator.query('button')).toHaveClass('success');
  });
  it('make where condition ', () => {
    const firstname = [{first_name: 'test'}];
    const result = spectator.component.makeWhereCondition(firstname);
    expect(result).toEqual([{first_name: {contains:'test'}}]);
  })
  fit('make multi where condition ', () => {
    const input = [{first_name: 'test'},{gender: 'Male'}];
    const result = spectator.component.makeWhereCondition(input);
    expect(result).toEqual([{first_name: {contains:'test'}},{ gender: {contains:'Male'}}]);
  })
});
