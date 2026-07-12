import { getState, getGroups } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, THead, Th, TBody, Tr, Td } from '@/components/ui/table'
import { BarChartCard } from '@/components/charts'

export default function GroupsPage() {
  const state = getState()
  const groups = getGroups()

  const postDist = [
    { name: '1 link', value: groups.filter(g => g.totalPosts === 1).length },
    { name: '2 links', value: groups.filter(g => g.totalPosts === 2).length },
    { name: '3-5 links', value: groups.filter(g => g.totalPosts >= 3 && g.totalPosts <= 5).length },
    { name: '6-10 links', value: groups.filter(g => g.totalPosts >= 6 && g.totalPosts <= 10).length },
    { name: '10+ links', value: groups.filter(g => g.totalPosts > 10).length },
  ]

  const topGroups = groups.slice(0, 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
        <p className="text-muted-foreground text-sm mt-1">{groups.length} Facebook groups reached with {state.totalPostedLinks} affiliate links</p>
      </div>

      <Card className="card-hover">
        <CardHeader className="border-b border-border/50"><CardTitle className="flex items-center gap-2"><span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 inline-block" /> Posts per Group Distribution</CardTitle></CardHeader>
        <CardContent>
          <BarChartCard data={postDist} dataKey="value" nameKey="name" color="#06b6d4" height={250} />
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader><CardTitle>Top Groups by Post Count</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <THead>
              <Tr>
                <Th>#</Th>
                <Th>Group URL</Th>
                <Th>Total Posts</Th>
                <Th>Links</Th>
              </Tr>
            </THead>
            <TBody>
              {topGroups.map((g, i) => (
                <Tr key={g.url} className="transition-colors duration-150 hover:bg-muted/30">
                  <Td className="text-muted-foreground text-xs">{i + 1}</Td>
                  <Td className="max-w-[400px] truncate">
                    <a href={g.url} target="_blank" rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2">
                      {g.url}
                    </a>
                  </Td>
                  <Td><Badge variant="success">{g.totalPosts}</Badge></Td>
                  <Td className="max-w-[200px] truncate text-xs text-muted-foreground">
                    {g.links.slice(0, 3).join(', ')}{g.links.length > 3 ? '...' : ''}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
