import { Mail, Search, Eye, EyeOff, Plus, Trash2, Save, Download, Upload } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ServersPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [cpuThreshold, setCpuThreshold] = useState([75])
  const [memoryThreshold, setMemoryThreshold] = useState([50, 90])

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-section)" }}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Servers</h2>
        <p className="text-muted-foreground text-sm">
          Add and configure server monitoring profiles
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="alerts">Alert Rules</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="flex flex-col" style={{ gap: "var(--space-section)" }}>
          {/* Text Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Server Details</CardTitle>
              <CardDescription>Basic information about the server</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hostname">Hostname</Label>
                  <Input id="hostname" placeholder="e.g. prod-web-01" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ip">IP Address</Label>
                  <Input id="ip" placeholder="192.168.1.100" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="search">Search Tags</Label>
                  <div className="relative">
                    <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                    <Input id="search" placeholder="Search..." className="pl-9" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                    <Input id="email" type="email" placeholder="admin@example.com" className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">SSH Key Passphrase</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter passphrase"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="disabled">Disabled Input</Label>
                  <Input id="disabled" placeholder="Cannot edit" disabled />
                </div>
              </div>

              {/* Select */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="region">Region</Label>
                  <Select>
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west">EU West (Ireland)</SelectItem>
                      <SelectItem value="ap-southeast">AP Southeast (Singapore)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="os">Operating System</Label>
                  <Select>
                    <SelectTrigger id="os">
                      <SelectValue placeholder="Select OS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ubuntu">Ubuntu 24.04 LTS</SelectItem>
                      <SelectItem value="debian">Debian 12</SelectItem>
                      <SelectItem value="rhel">RHEL 9</SelectItem>
                      <SelectItem value="windows">Windows Server 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Textarea */}
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional notes about this server..." rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes-disabled">Read-only Notes</Label>
                <Textarea
                  id="notes-disabled"
                  value="This server was provisioned on 2025-12-01 and is part of the production cluster."
                  disabled
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Rules Tab */}
        <TabsContent value="alerts" className="flex flex-col" style={{ gap: "var(--space-section)" }}>
          {/* Checkboxes & Radios */}
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Channels</CardTitle>
              <CardDescription>Choose which alert channels to enable</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="grid gap-4">
                  <Label className="text-sm font-medium">Alert Channels</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox id="ch-email" defaultChecked />
                    <Label htmlFor="ch-email" className="font-normal">Email notifications</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="ch-slack" defaultChecked />
                    <Label htmlFor="ch-slack" className="font-normal">Slack integration</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="ch-sms" />
                    <Label htmlFor="ch-sms" className="font-normal">SMS alerts</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="ch-webhook" />
                    <Label htmlFor="ch-webhook" className="font-normal">Webhook</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="ch-disabled" disabled />
                    <Label htmlFor="ch-disabled" className="font-normal text-muted-foreground">PagerDuty (requires upgrade)</Label>
                  </div>
                </div>

                <div className="grid gap-4">
                  <Label className="text-sm font-medium">Alert Severity</Label>
                  <RadioGroup defaultValue="warning">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="critical" id="sev-critical" />
                      <Label htmlFor="sev-critical" className="font-normal">Critical only</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="warning" id="sev-warning" />
                      <Label htmlFor="sev-warning" className="font-normal">Warning and above</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="info" id="sev-info" />
                      <Label htmlFor="sev-info" className="font-normal">All (including info)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Switches & Toggles */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Preferences</CardTitle>
              <CardDescription>Toggle monitoring features on or off</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="grid gap-0.5">
                  <Label htmlFor="auto-resolve">Auto-resolve alerts</Label>
                  <p className="text-muted-foreground text-xs">Automatically resolve when metric returns to normal</p>
                </div>
                <Switch id="auto-resolve" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="grid gap-0.5">
                  <Label htmlFor="escalation">Escalation policy</Label>
                  <p className="text-muted-foreground text-xs">Escalate unacknowledged alerts after 15 minutes</p>
                </div>
                <Switch id="escalation" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="grid gap-0.5">
                  <Label htmlFor="maintenance">Maintenance mode</Label>
                  <p className="text-muted-foreground text-xs">Suppress all alerts during maintenance windows</p>
                </div>
                <Switch id="maintenance" />
              </div>
              <Separator />
              <div className="grid gap-3">
                <Label className="text-sm font-medium">Quick Actions</Label>
                <ToggleGroup type="multiple" variant="outline">
                  <ToggleGroupItem value="mute">Mute</ToggleGroupItem>
                  <ToggleGroupItem value="snooze">Snooze 1h</ToggleGroupItem>
                  <ToggleGroupItem value="acknowledge">Acknowledge</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>

          {/* Sliders */}
          <Card>
            <CardHeader>
              <CardTitle>Thresholds</CardTitle>
              <CardDescription>Set alert trigger thresholds for key metrics</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label>CPU Usage Alert</Label>
                  <span className="text-muted-foreground text-sm">{cpuThreshold[0]}%</span>
                </div>
                <Slider value={cpuThreshold} onValueChange={setCpuThreshold} max={100} step={5} />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label>Memory Usage Range</Label>
                  <span className="text-muted-foreground text-sm">{memoryThreshold[0]}% – {memoryThreshold[1]}%</span>
                </div>
                <Slider value={memoryThreshold} onValueChange={setMemoryThreshold} max={100} step={5} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Control Tab */}
        <TabsContent value="access" className="flex flex-col" style={{ gap: "var(--space-section)" }}>
          <Card>
            <CardHeader>
              <CardTitle>Access Permissions</CardTitle>
              <CardDescription>Configure who can access this server</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="access-role">Default Role</Label>
                  <Select>
                    <SelectTrigger id="access-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="operator">Operator</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="auth-method">Auth Method</Label>
                  <Select>
                    <SelectTrigger id="auth-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ssh-key">SSH Key</SelectItem>
                      <SelectItem value="password">Password</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3">
                <Label className="text-sm font-medium">Protocol Access</Label>
                <ToggleGroup type="multiple" variant="outline" defaultValue={["ssh", "https"]}>
                  <ToggleGroupItem value="ssh">SSH</ToggleGroupItem>
                  <ToggleGroupItem value="https">HTTPS</ToggleGroupItem>
                  <ToggleGroupItem value="rdp">RDP</ToggleGroupItem>
                  <ToggleGroupItem value="vnc">VNC</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="grid gap-3">
                <Label className="text-sm font-medium">View Mode</Label>
                <div className="flex gap-2">
                  <Toggle variant="outline" defaultPressed aria-label="Toggle bold">
                    Bold
                  </Toggle>
                  <Toggle variant="outline" aria-label="Toggle italic">
                    Italic
                  </Toggle>
                  <Toggle variant="outline" disabled aria-label="Toggle underline">
                    Underline
                  </Toggle>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Buttons — always visible */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Button variants and sizes</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-wrap gap-3">
            <Button><Save className="size-4" /> Save</Button>
            <Button variant="secondary"><Download className="size-4" /> Export</Button>
            <Button variant="destructive"><Trash2 className="size-4" /> Delete</Button>
            <Button variant="outline"><Upload className="size-4" /> Import</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="link">Learn more</Button>
          </div>
          <Separator />
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg"><Plus className="size-4" /> Large</Button>
            <Button size="default">Default</Button>
            <Button size="sm">Small</Button>
            <Button size="xs">Extra Small</Button>
            <Button size="icon" variant="outline"><Settings2Icon /></Button>
            <Button disabled>Disabled</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Inline icon to avoid adding another import at top-level for a single use
function Settings2Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
  )
}
